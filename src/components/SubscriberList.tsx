export default function SubscriberList({ subscribers }) {
    return (
      <ul className="space-y-2">
        {subscribers.map((subscriber) => (
          <li key={subscriber.id} className="p-2 bg-gray-100 rounded">
            {subscriber.email} - {subscriber.contact_type}
          </li>
        ))}
      </ul>
    )
  }