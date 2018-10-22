import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() { }

  findId(attrName, attributes): String {
    let id = '';
    attributes.forEach(attr => {
      if (attr.name == attrName) id = attr._id
    })
    return id;
  }
}
