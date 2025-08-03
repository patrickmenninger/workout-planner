import axios from 'axios';
import supabase from './supabase.js';

const BASE_URL = 'localhost:3000/api';

const login = async (email, password) => {
    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw error;

    return data;

}

const getWorkoutsByUserId = (userId) => {
    axios.get(BASE_URL + "/workouts")
}

export default {
    login
}