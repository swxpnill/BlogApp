//! Importing configuration and Appwrite SDK components
import conf from "../config/conf.js";
import { Client, Account, ID } from "appwrite";

//! Initializes AuthService to handle user authentication
export class AuthService {
    client = new Client();
    account;

    constructor() {
        //? Sets up Appwrite client with endpoint and project configuration
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    //? Creates a new user account  
    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                //? call another method for logging in
                return this.login({ email, password })
            } else {
                return userAccount;
            }
        } catch (error) {
            console.log("Appwrite service :: createAccount :: error", error);
        }
    }

    //? Logs in the user with email and password
    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.log("Appwrite service :: login :: error", error);
        }
    }

    //? Retrieves the current user information
    async getCurrentUser(sessions) {
        try {
            return await this.account.get(sessions);
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
        }
        return null;
    }

    //? Logs out the user by deleting all sessions
    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
        }
    }

}

//! Exporting an instance of AuthService for use in other parts of the application
const authService = new AuthService();
export default authService;