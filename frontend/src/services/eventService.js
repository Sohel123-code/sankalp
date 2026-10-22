/**
 * eventService.js
 * Centralised service layer for all events-related data operations.
 * Uses the Supabase client for direct DB access (read-only for guests).
 */
import { supabase } from '../lib/supabaseClient'

/**
 * Fetch all published events, sorted by date ascending.
 * @returns {Promise<Array>}
 */
export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

/**
 * Fetch a single event by ID.
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export async function getEventById(id) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

/**
 * Fetch events filtered by category.
 * @param {string} category
 * @returns {Promise<Array>}
 */
export async function getEventsByCategory(category) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('category', category)
    .order('event_date', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

/**
 * Search events by title (case-insensitive).
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function searchEvents(query) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .ilike('title', `%${query}%`)
    .order('event_date', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}
