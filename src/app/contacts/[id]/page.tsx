// app/contacts/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function ContactDetails() {
  const [contact, setContact] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetchContact() {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) console.error('Error fetching contact:', error);
      else setContact(data);
    }
    fetchContact();
  }, [id]);

  if (!contact) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detalji kontakta</h1>
      <p><strong>Ime:</strong> {contact.name}</p>
      <p><strong>Email:</strong> {contact.email}</p>
      <p><strong>Telefon:</strong> {contact.phone}</p>
    </div>
  );
}