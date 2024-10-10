import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private LocationRepository: Repository<Location>
  ){}
  create(createLocationDto: CreateLocationDto) {
    return this.LocationRepository.save(createLocationDto)
  }

  findAll() {
    return this.LocationRepository.find()
  }

  findOne(id: number) {
    const location =  this.LocationRepository.findOneBy({
      locationId: id
    })
    if(!location) throw new NotFoundException("Location Not Found");
    return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    const location = await this.LocationRepository.preload({
      locationId: id,
      ...updateLocationDto
    })
    return this.LocationRepository.save(location)
  }

  remove(id: number) {
    return this.LocationRepository.delete({
      locationId: id
    })
  }
}
