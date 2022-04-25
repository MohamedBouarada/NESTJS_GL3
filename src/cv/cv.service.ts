import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
  ) {}

  create(createCvDto: CreateCvDto) {
    return this.cvRepository.save(createCvDto);
  }

  findAll() {
    return this.cvRepository.find();
  }

  findOne(id: number) {
    return this.cvRepository.findOneBy({ id });
  }

  async update(id: number, updateCvDto: UpdateCvDto) {
    const newCv = await this.cvRepository.preload({ id, ...updateCvDto });
    if (newCv) {
      return this.cvRepository.save(newCv);
    } else {
      throw new NotFoundException(`Le CV d'id ${id} n'existe pas `);
    }
  }

  remove(id: number) {
    return this.cvRepository.delete(id);
  }
}
