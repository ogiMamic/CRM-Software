import { useEffect, useState } from 'react';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => setContacts(data));
  }, []);

  return (
    <div>
      <h1>Contacts</h1>
      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>{contact.name} - {contact.email}</li>
        ))}
      </ul>
    </div>
  );
}