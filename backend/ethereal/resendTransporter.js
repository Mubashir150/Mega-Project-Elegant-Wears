import dotenv from "dotenv"
dotenv.config()
import {Resend} from "resend"

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;