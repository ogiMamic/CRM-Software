'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export function ContactManager() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '' });
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  async function fetchContacts() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id);
    if (error) console.error('Error fetching contacts:', error);
    else setContacts(data);
  }

  async function addContact(e) {
    e.preventDefault();
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ ...newContact, user_id: user.id }]);
    if (error) console.error('Error adding contact:', error);
    else {
      setNewContact({ name: '', email: '', phone: '' });
      fetchContacts();
    }
  }

  async function deleteContact(id) {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    if (error) console.error('Error deleting contact:', error);
    else fetchContacts();
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Kontakti</h2>
      <form onSubmit={addContact} className="mb-4">
        <input
          type="text"
          placeholder="Ime"
          value={newContact.name}
          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
          className="mr-2 p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={newContact.email}
          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
          className="mr-2 p-2 border rounded"
        />
        <input
          type="tel"
          placeholder="Telefon"
          value={newContact.phone}
          onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
          className="mr-2 p-2 border rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Dodaj kontakt</button>
      </form>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id} className="mb-2">
            {contact.name} - {contact.email} - {contact.phone}
          </li>
        ))}
      </ul>
      <ul>
  {contacts.map((contact) => (
    <li key={contact.id} className="mb-2 flex justify-between items-center">
    <Link href={`/contacts/${contact.id}`}>
      <span className="cursor-pointer hover:underline">
        {contact.name} - {contact.email} - {contact.phone}
      </span>
    </Link>
    <button 
      onClick={() => deleteContact(contact.id)}
      className="p-1 bg-red-500 text-white rounded"
    >
      Izbriši
    </button>
  </li>
  ))}
</ul>
      
    </div>
  );
}