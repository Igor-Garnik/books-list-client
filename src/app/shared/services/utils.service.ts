import { Injectable } from '@angular/core';
import { Book } from '../models/book';

@Injectable()
export class UtilsService {

  constructor() { }

  findId(attrName, attribut): String {
    let id = '';
    attribut.forEach(attr => {
      if (attr.name == attrName) id = attr._id
    })
    return id;
  }

  getComplitedData(data, formatsDta) {
    let completedData = {}
    for (var i in data) {
      if (data[i]) {
        if (i == 'formatId') {
          let id = this.findFormatId(data[i], formatsDta);
          completedData[i] = id;
        } else {
          completedData[i] = data[i];
        }
      }
    }
    return completedData;
  }

  findFormatId(data, formatsData) {
    let id: Number;
    formatsData.forEach(format => {
      if (format.name == data) id = format._id
    })
    return id;
  }

  setIds(bookParams: Book, attributes: Array<any>): Book {
    let bookCopy = Object.assign({}, bookParams);
    attributes.forEach((attribute) => {
      let attributeName = attribute['name'] /*attributeName - countryId, companyId, cityId, formatId */
      attribute.value.forEach(item => {
        if (item.name == bookCopy[attributeName]) bookCopy[attributeName] = item._id
      })
    })
    return bookCopy
  }
}
