import Fs from 'node:fs';
import Path from 'node:path';
import { RunOutput, Terminal } from './terminal';

export type Status =
    | 'NO_GIT_REPO'
    | 'PENDING_ADD'
    | 'PENDING_COMMIT'
    | 'PENDING_PUSH'
    | 'UP_TO_DATE'
    | 'CREATED_NEWS'
    | 'NOTHING_TO_COMMIT'
    | 'UNKNOW_STATE';

export class ErrorGettingStatus extends Error {}

export class Git {
    static async status(path: string): Promise<Status> {
        const runOutput: RunOutput = await Terminal.run(
            `cd ${path} && git status --porcelain`,
        );
        const output: string = (
            runOutput.stdout + runOutput.stderr
        ).toLowerCase();
        if (output.includes('fatal: not a git repository')) {
            return 'NO_GIT_REPO';
        }

        const options: string[] = ['a', 'd', 'm'];

        let pendingToCommit: boolean = false;
        output.split('\n').forEach((line: string) => {
            if (line == '') {
                return;
            }
            const lineItems: string[] = line.trim().split(' ');
            if (lineItems[0] == '??') {
                return 'PENDING_ADD';
            }

            if (
                options.some((option: string) => lineItems[0].includes(option))
            ) {
                pendingToCommit = true;
            }
        });
        if (pendingToCommit) {
            return 'PENDING_COMMIT';
        }

        const runOutput2: RunOutput = await Terminal.run(
            `cd ${path} && git status`,
        );
        const output2: string = (
            runOutput2.stdout + runOutput2.stderr
        ).toLowerCase();
        if (output2.includes('your branch is ahead of')) {
            return 'PENDING_PUSH';
        } else if (output2.includes('your branch is up')) {
            return 'NOTHING_TO_COMMIT';
        } else if (output2.includes('nothing to commit')) {
            return 'NOTHING_TO_COMMIT';
        } else {
            throw new ErrorGettingStatus(
                `unable to find git status from path "${path}"`,
            );
        }
    }
    static async getReposInsidePath(
        path: string,
    ): Promise<{ path: string; status: Status }[]> {
        const repos: { path: string; status: Status }[] = [];
        const files: string[] = Fs.readdirSync(path);
        for (const file of files) {
            const fullPath: string = Path.join(path, file);
            if (!Fs.statSync(fullPath).isDirectory()) {
                continue;
            }

            const status: Status = await Git.status(fullPath);
            if (status === 'NO_GIT_REPO') {
                const resposInside: { path: string; status: Status }[] =
                    await Git.getReposInsidePath(fullPath);
                repos.push(...resposInside);
            } else {
                repos.push({ path: fullPath, status });
            }
        }
        return repos;
    }
}
