import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';

export class BoardsService {
	constructor(
		@InjectRepository(BoardRepository)
		private boardRepository: BoardRepository
	) {}

	async getAllBoards(): Promise<Board[]> {
		return this.boardRepository.find();
	}

	createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
		return this.boardRepository.createBoard(createBoardDto);
	}

	async getBoardById(id: number): Promise<Board> {
		// const found = await this.boardRepository.findOne(id);
		const found = await this.boardRepository.findOne({ where: {id} });

		if (!found) {
			throw new NotFoundException(`Can't find Board with id ${id}`);
		}

		return found;
	}

	/*
	remove vs delete
	remove: 반드시 아이템이 존재할 경우 사용 (그렇지 않으면 404 에러)
	delete: 아이템이 존재하면 지움, 그렇지 않으면 아무런 영향이 없음
	*/
	
	async deleteBoard(id: number): Promise<void> {
		const result = await this.boardRepository.delete(id);
		
		// console.log('result', result);
		if (result.affected === 0) {
			throw new NotFoundException(`Can't find Board with id ${id}`);
		}
	}

	async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
		const board = await this.getBoardById(id);

		board.status = status;
		await this.boardRepository.save(board);

		return board;
	}
}
