export class InternalServerError extends Error{

    public readonly cause?: unknown
    public readonly action : String
    public readonly statusCode :number


    constructor({cause,statusCode}){
        super("Um erro inesperado ocorreu")

        this.name = "InternalServerError";
        this.cause = cause;
        this.action= "Entre em contato com o suporte";
        this.statusCode = statusCode || 500;
    }

    toJSON(){
        return{
            name :this.name,
            messege: this.message,
            action: this.action,
            status_code: this.statusCode
        }
    }
}