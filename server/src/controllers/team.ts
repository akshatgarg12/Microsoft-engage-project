import {Request, Response} from 'express'

const getTeams = async (req:Request, res:Response) => {
    // get the user object from isAuthenticated middleware
    // @ts-ignore
    const {user} = req;
    res.status(200).json({status:'200', log:'teams of user', teams:user.teams})
}

export {
    getTeams
}