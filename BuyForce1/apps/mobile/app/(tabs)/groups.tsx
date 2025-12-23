// apps/web/app/(tabs)/groups.tsx
import React, { useState } from "react";

interface Group {
  id: number;
  name: string;
  description: string;
}

const groupsData: Group[] = [
  { id: 1, name: "Group A", description: "This is Group A" },
  { id: 2, name: "Group B", description: "This is Group B" },
  { id: 3, name: "Group C", description: "This is Group C" },
];

const Groups: React.FC = () => {
  const [activeGroupId, setActiveGroupId] = useState<number>(groupsData[0].id);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Groups</h1>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        {groupsData.map((group) => (
          <button
            key={group.id}
            className={`px-4 py-2 -mb-px border-b-2 font-medium ${
              activeGroupId === group.id
                ? "border-blue-500 text-blue-500"
                : "border-transparent text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveGroupId(group.id)}
          >
            {group.name}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="p-4 border rounded">
        {groupsData.map(
          (group) =>
            group.id === activeGroupId && (
              <div key={group.id}>
                <h2 className="text-xl font-semibold">{group.name}</h2>
                <p className="mt-2">{group.description}</p>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Groups;
