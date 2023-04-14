import React, { useState } from 'react';

type Column = {
  id: string;
  label: string;
  sortable: boolean;
};

type Data = {
  [key: string]: string | number;
};

type Props = {
  columns: Column[];
  data: Data[];
};

export const SortableTable: React.FC<Props> = ({ columns, data }) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const sortedData = React.useMemo(() => {
    const sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = (key: string, sortable: boolean) => {
    if (!sortable) return;
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.id}
              onClick={() => requestSort(column.id, column.sortable)}
              style={{ cursor: column.sortable ? 'pointer' : 'default' }}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.id}>{row[column.id]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
