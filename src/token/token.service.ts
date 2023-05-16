import { Person } from "@prisma/client"
import { UserPublic } from "../types/types"
import { Response } from "express"

export const createAccessToken = async (user: UserPublic) => {

}

export const setRefreshToken = (res: Response, user: UserPublic) => {

}

export const removeRefreshToken = async (token: string) => {

}

export const decodeAccessToken = (token: string) => {

}

export const validateAccessToken = (token: string) => {

}

export const validateRefreshToken = async (token: string) => {
    
}