import { computed, reactive, ref } from 'vue'
import axios from 'axios'

const state = reactive({
    authenticated: false,
    user: {}
})

export default function useAuth() {
    const authenticated = computed(() => state.authenticated)
    const user = computed(() => state.user)

    const setAuthenticated = (authenticated) => {
        state.authenticated = authenticated
    }

    const setUser = (user) => {
        state.user = user
    }

    const login = async (credentials) => {
        try {
            // attempt authentication
        } catch (e) {
            // authentication failed
        }
    }

    const attempt = async () => {
        try {
            // attempt to fetch user
        } catch (e) {
            // fetching the user failed
        }
    }

    return {
        authenticated,
        user,
        login,
        attempt
    }
}