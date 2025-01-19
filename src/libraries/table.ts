export class Table {
    static computeRowsWidth(rows: any[]): { [key: string]: number } {
        const widths: { [key: string]: number } = {};
        rows.map((row: any) => {
            const columns: string[] = Object.keys(row);
            columns.map((column: string) => {
                const columnWidth: number = `${row[column]}`.length + 2;
                if (!widths[column]) {
                    widths[column] = columnWidth;
                } else {
                    if (columnWidth > widths[column]) {
                        widths[column] = columnWidth;
                    }
                }
            });
        });
        return widths;
    }
    static printRow(
        widths: { [key: string]: number },
        row: any,
        columnsToPrint: string[],
    ): void {
        process.stdout.write(`|`);
        columnsToPrint.map((column: string) => {
            const widthAvailable: number = widths[column];
            const widthUssed: number = `${row[column]}`.length;
            const widthPending: number = widthAvailable - widthUssed - 1;
            process.stdout.write(` ${row[column]}${' '.repeat(widthPending)}|`);
        });
        console.log('');
    }
    static printHeader(
        widths: { [key: string]: number },
        columnsToPrint: string[],
    ): void {
        process.stdout.write(`+`);
        columnsToPrint.map((column: string) => {
            const widthAvailable: number = widths[column];
            process.stdout.write(`${'-'.repeat(widthAvailable)}+`);
        });
        console.log('');
    }
    static print(rows: any[], columnsToPrint: string[]): void {
        if (rows.length === 0) {
            return;
        }

        const widths: { [key: string]: number } = Table.computeRowsWidth(rows);
        const headers: any = {};
        Object.keys(rows[0]).map(
            (column: string) => (headers[column] = column),
        );
        const rowsToPrint: any[] = [headers, ...rows];
        rowsToPrint.map((row: any) => {
            Table.printHeader(widths, columnsToPrint);
            Table.printRow(widths, row, columnsToPrint);
        });
        Table.printHeader(widths, columnsToPrint);
    }
}
