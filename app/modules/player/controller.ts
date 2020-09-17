import { Request, Response } from 'express';
import * as service from './service';
import { errorMessage } from 'iyasunday';

export async function create(req: Request, res: Response) {
  try {
    res.status(200).json(await service.create(req.params, req.body));
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}

export async function list(req: Request, res: Response) {
  try {
    res.status(200).json(await service.list(req.params));
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}

export async function remove(req: Request, res: Response) {
  try {
    res.status(200).json(await service.remove(req.params));
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}
