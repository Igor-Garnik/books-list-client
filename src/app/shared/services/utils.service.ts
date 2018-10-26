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

  setErrorMessage(formErrors, validationMessages, newBookForm, config): any {
    let formErr = Object.assign({}, formErrors);
    for (let item in formErr) {
      formErr[item] = "";
      let control = newBookForm.get(item);

      if (control[config.name]) {
        let message = validationMessages[item];
        for (let key in control.errors) {
          formErr[item] += message[key];
        }
      }
    }
    return formErr;
  }

  clearFormFields(form): any {
    let copyFormFields = Object.assign({}, form);
    for (let key in copyFormFields) {
      copyFormFields[key] = '';
    }
    return copyFormFields;
  }

  completeFormFields(formFields, data): any {
    let form = Object.assign({}, formFields);
    for (let key in form) {
      form[key][0] = data[key] ? data[key] : '';
      //form[key][0] = data[key];
    }
    console.log(formFields);
    console.log(form);
    return form;
  }
}
