import { Git, Status } from './libraries/git';
import { Table } from './libraries/table';

async function main(): Promise<void> {
    const paths: string[] = process.argv.splice(2);

    const repositories: { path: string; status: Status }[] = [];
    for (const path of paths) {
        const pathRepositories: { path: string; status: Status }[] =
            await Git.getReposInsidePath(path);
        repositories.push(...pathRepositories);
    }
    Table.print(repositories, ['status', 'path']);
}

main().catch(console.error);
