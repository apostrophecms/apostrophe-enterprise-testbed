module.exports = {
  construct: function (self, options) {
    self.addTask('addForm', 'Imports a complete form for use in testing.', (apos, argv) => {
      const req = apos.tasks.getReq();
      // import the form.
      return self.insert(req, piece);
    });
  }
};

const piece = {
  'published': true,
  'type': 'apostrophe-forms',
  'title': 'Dog form',
  'tags': [],
  'contents': {
    'type': 'area',
    'items': [
      {
        '_id': 'dogNameField',
        'fieldLabel': 'Dog name',
        'fieldName': 'DogName',
        'required': true,
        'type': 'apostrophe-forms-text-field'
      },
      {
        '_id': 'dogTraitsField',
        'fieldLabel': 'Check all that apply',
        'fieldName': 'DogTraits',
        'required': true,
        'type': 'apostrophe-forms-checkboxes-field',
        'choices': [
          {
            'label': 'Runs fast',
            'value': 'Runs fast'
          },
          {
            'label': 'Barks loudly',
            'value': 'Barks loudly'
          },
          {
            'label': 'Likes treats',
            'value': 'Likes treats'
          }
        ]
      },
      {
        '_id': 'dogBreedField',
        'fieldLabel': 'Dog breed',
        'fieldName': 'DogBreed',
        'required': false,
        'type': 'apostrophe-forms-radio-field',
        'choices': [
          {
            'label': 'Irish Wolfhound',
            'value': 'Irish Wolfhound'
          },
          {
            'label': 'Cesky Terrier',
            'value': 'Cesky Terrier'
          },
          {
            'label': 'Dachshund',
            'value': 'Dachshund'
          },
          {
            'label': 'Pumi',
            'value': 'Pumi'
          }
        ]
      },
      {
        '_id': 'dogPhotoField',
        'fieldLabel': 'Photo of your dog',
        'fieldName': 'DogPhoto',
        'required': false,
        'type': 'apostrophe-forms-file-field'
      },
      {
        '_id': 'dogToyField',
        'fieldLabel': 'Dog Toy Choice',
        'fieldName': 'DogToy',
        'required': true,
        'type': 'apostrophe-forms-select-field',
        'choices': [
          {
            'label': 'Bone',
            'value': 'Bone'
          },
          {
            'label': 'Rope',
            'value': 'Rope'
          },
          {
            'label': 'Ball',
            'value': 'Ball'
          },
          {
            'label': 'Frisbee',
            'value': 'Frisbee'
          }
        ]
      },
      {
        '_id': 'dogLifeStoryField',
        'fieldLabel': 'Life Story',
        'fieldName': 'LifeStory',
        'required': false,
        'type': 'apostrophe-forms-textarea-field'
      },
      {
        '_id': 'optInField',
        'fieldLabel': 'Opt-in to participate',
        'fieldName': 'paticipate',
        'required': true,
        'checked': true,
        'type': 'apostrophe-forms-boolean-field'
      }
    ]
  },
  'submitLabel': 'Proceed',
  'thankYouHeading': 'Gracias.',
  'thankYouBody': {
    'items': [
      {
        '_id': 'thankYouTextWidget',
        'type': 'apostrophe-rich-text',
        'content': '<p>Thanks for your submission!</p>'
      }
    ],
    'type': 'area'
  },
  // 'googleSheetSubmissions': true,
  // 'googleSpreadsheetId': '13n0VV1bSEp-CKj26sBtFdIzmSENhRoMSuaxDrGh_O88',
  // 'googleSheetName': 'Dog Info',
  'enableQueryParams': true,
  'queryParamList': [
    {
      'key': 'source'
    }
  ],
  'queryParamLimit': null
};
