import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Table {
  id: string;
  number: number;
  seats: number;
  position: { x: number; y: number };
}

const initialTables: Table[] = [
  { id: '1', number: 1, seats: 4, position: { x: 0, y: 0 } },
  { id: '2', number: 2, seats: 2, position: { x: 100, y: 0 } },
  { id: '3', number: 3, seats: 6, position: { x: 0, y: 100 } },
];

const TableManagement: React.FC = () => {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [newTable, setNewTable] = useState({ number: '', seats: '' });

  const handleAddTable = () => {
    if (newTable.number && newTable.seats) {
      const newId = (tables.length + 1).toString();
      setTables([...tables, {
        id: newId,
        number: parseInt(newTable.number),
        seats: parseInt(newTable.seats),
        position: { x: 0, y: 0 }
      }]);
      setNewTable({ number: '', seats: '' });
    }
  };

  const handleDeleteTable = (id: string) => {
    setTables(tables.filter(table => table.id !== id));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(tables);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTables(items);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Table Management</h1>
      
      {/* Add new table form */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Table</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                Table Number
              </label>
              <input
                type="number"
                name="number"
                id="number"
                value={newTable.number}
                onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="seats" className="block text-sm font-medium text-gray-700">
                Number of Seats
              </label>
              <input
                type="number"
                name="seats"
                id="seats"
                value={newTable.seats}
                onChange={(e) => setNewTable({ ...newTable, seats: e.target.value })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={handleAddTable}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Table
            </button>
          </div>
        </div>
      </div>

      {/* Table list with drag and drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tables">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="bg-white shadow overflow-hidden sm:rounded-lg">
              {tables.map((table, index) => (
                <Draggable key={table.id} draggableId={table.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="px-4 py-4 sm:px-6 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          Table {table.number} - {table.seats} seats
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <button
                            onClick={() => handleDeleteTable(table.id)}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TableManagement;
