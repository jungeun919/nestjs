import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { BoardStatus } from "./board-status.enum";
import { CreateBoardDto } from "./dto/create-board.dto";
import { BoardStatusValidationPipe } from "./pipes/board-status-validation.pipe";
import { Board } from "./board.entity";
import { AuthGuard } from "@nestjs/passport";

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
	constructor(private boardsService: BoardsService) {}

	@Get()
	getAllBoard(): Promise<Board[]> {
		return this.boardsService.getAllBoards();
	}

	@Post()
	@UsePipes(ValidationPipe)
	createBoard(
		@Body() createBoardDto: CreateBoardDto
	): Promise<Board> {
		return this.boardsService.createBoard(createBoardDto);
	}

	@Get('/:id')
	getBoardById(@Param('id') id: number): Promise<Board> {
		return this.boardsService.getBoardById(id);
	}

	@Delete('/:id')
	deleteBoard(@Param('id', ParseIntPipe) id): Promise<void> {
		return this.boardsService.deleteBoard(id);
	}

	// /*
	// 데코레이터
	// @Param: URL 경로에서 파라미터 값을 추출
	// @Body: HTTP 요청의 body에서 데이터 추출
	// */

	@Patch('/:id/status')
	updateBoardStatus(
		@Param('id', ParseIntPipe) id: number,
		@Body('status', BoardStatusValidationPipe) status: BoardStatus
	) {
		return this.boardsService.updateBoardStatus(id, status);
	}
}
