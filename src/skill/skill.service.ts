import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}
  create(createSkillDto: CreateSkillDto) {
    return this.skillRepository.save(createSkillDto);
  }

  findAll() {
    return this.skillRepository.find();
  }

  findOne(id: number) {
    return this.skillRepository.findOneBy({ id });
  }

  async update(id: number, updateSkillDto: UpdateSkillDto) {
    const newSkill = await this.skillRepository.preload({
      id,
      ...updateSkillDto,
    });
    if (newSkill) {
      return this.skillRepository.save(newSkill);
    } else {
      throw new NotFoundException(`Le Skill d'id ${id} n'existe pas `);
    }
  }

  remove(id: number) {
    return this.skillRepository.delete(id);
  }
}
