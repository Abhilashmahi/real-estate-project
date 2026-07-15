import React from 'react';

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export default function DataTable<T>({ columns, data, emptyMessage = 'No records found.' }: DataTableProps<T>) {
  return (
    <div className="table-container">
      {data.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          {emptyMessage}
        </div>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>{col.accessor(item)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
