import { MongoClient } from 'mongodb'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      mongodb: MongoClient
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
