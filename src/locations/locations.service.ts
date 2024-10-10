import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationsService {
  constructor(
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

  update(id: number, updateLocationDto: UpdateLocationDto) {
    const location = this.LocationRepository.preload({
      locationId: id,
      ...updateLocationDto
    })
    return location;
  }

  remove(id: number) {
    return this.LocationRepository.delete({
      locationId: id
    })
  }
}
