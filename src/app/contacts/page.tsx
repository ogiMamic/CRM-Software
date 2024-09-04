import { useEffect, useState } from 'react';
import { Contact } from './types'; // Assuming the 'Contact' type is defined in a separate file called 'types.ts'

type Contact = {
  id: number;
  name: string;
  email: string;
}

const [contacts, setContacts] = useState<Contact[]>([])

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => setContacts(data));
  }, []);

  return (
    <div>
      <h1>Contacts</h1>
      <ul>
        {contacts.map((contact: Contact) => (
          <li key={contact.id}>{contact.name} - {contact.email}</li>
        ))}
      </ul>
    </div>
  );
}