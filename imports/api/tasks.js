import { Mongo } from 'meteor/mongo';

// This creates the MongoDB collection called 'tasks'
export const Tasks = new Mongo.Collection('tasks');
