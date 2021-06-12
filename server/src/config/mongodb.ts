import mongoose from 'mongoose'


const DatabaseConnection = async () => {
    try{
        const URI:string = process.env.MONGODB_URL || 'mongodb://localhost:27017/Teams'
    
        await mongoose.connect(URI, {
            autoIndex:true,
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log('Database connected successfully.')

    }catch(e){
        throw e
    }
}


export default DatabaseConnection