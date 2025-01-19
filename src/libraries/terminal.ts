import ChildProcess, { ExecException } from 'child_process';

export type RunOutput = {
    code: string | undefined;
    stdout: string;
    stderr: string;
};

export class Terminal {
    static run(command: string): Promise<RunOutput> {
        return new Promise((resolve) =>
            ChildProcess.exec(
                command,
                (
                    error: ExecException | null,
                    stdout: string,
                    stderr: string,
                ) => {
                    resolve({
                        code:
                            error && error.code
                                ? error.code.toString()
                                : undefined,
                        stdout,
                        stderr,
                    });
                },
            ),
        );
    }
}
