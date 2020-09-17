import { Request, Response } from 'express';
import * as service from './service';
import { errorMessage } from 'iyasunday';

export async function create(req: Request, res: Response) {
  try {
    res.status(200).json(await service.create(req.body));
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}

export async function addScore(req: Request, res: Response) {
  try {
    res.status(200).json(await service.addScore(req.params, req.body));
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}

export async function view(req: Request, res: Response) {
  try {
    res
      .status(200)
      .json(
        await service.view(req.params, `${req.get('HOST')}${req.originalUrl}`)
      );
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}

export async function viewScore(req: Request, res: Response) {
  try {
    res
      .status(200)
      .json(
        await service.viewScore(req.params)
      );
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}

export async function list(req: Request, res: Response) {
  try {
    res
      .status(200)
      .json(await service.list(`${req.get('HOST')}${req.originalUrl}`));
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}
