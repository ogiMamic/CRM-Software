export default function SubscriberFilter({ currentFilter, onFilterChange }) {
    return (
      <div className="mb-4">
        <label className="mr-2">Filter by contact type:</label>
        <select
          value={currentFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="organic">Organic</option>
          <option value="campaign">Campaign</option>
          <option value="imported">Imported</option>
        </select>
      </div>
    )
  }