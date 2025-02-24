import jwt from 'jsonwebtoken';
import { NextFunction } from "express";
import { Request, Response } from 'express';
import { JWT_SECRET } from '../auth.controller';

export function verifyTokenMiddleware(req: Request, res: Response, next:NextFunction){

    const reqToken = req.headers['authorization'];

    if (!reqToken) res.status(403).json({msg:'Token no existente en la req'});

    jwt.verify(reqToken!.split(' ')[1], JWT_SECRET, (err: any, decoded: any) => {
        if (err) return res.status(401).json({ message: 'Token inválido' });
        req.body.user = decoded;
        next();
    });

}