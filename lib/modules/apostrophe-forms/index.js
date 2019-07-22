module.exports = {
  // Official reCAPTCHA testing keys. Uncomment to test manually. Not included
  // in functional tests since Nightwatch needs an ID on an iframe to move into // the iframe context, which reCAPTCHA does not provide.
  // recaptchaSite: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  // recaptchaSecret: '6LeIxAcTAAAAAGG- vFI1TnRWxMZNFuojJ4WifJWe',
  construct: function (self, options) {
    self.addTask('addForm', 'Imports a complete form for use in testing.', (apos, argv) => {
      const req = apos.tasks.getReq();
      // Import the form.
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
        '_id': 'pumiConditional',
        'conditionName': 'DogBreed',
        'conditionValue': 'Pumi',
        'contents': {
          'items': [
            {
              'fieldLabel': 'What color is your pumi?',
              'fieldName': 'pumiColor',
              'type': 'apostrophe-forms-text-field'
            },
            {
              'fieldLabel': 'How old is your pumi?',
              'fieldName': 'pumiAge',
              'type': 'apostrophe-forms-text-field'
            }
          ],
          'type': 'area'
        },
        'type': 'apostrophe-forms-conditional'
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
        '_id': 'ballConditional',
        'conditionName': 'DogToy',
        'conditionValue': 'Ball',
        'contents': {
          'items': [
            {
              'fieldLabel': 'What color ball?',
              'fieldName': 'ballColor',
              'type': 'apostrophe-forms-text-field'
            }
          ],
          'type': 'area'
        },
        'type': 'apostrophe-forms-conditional'
      }, {
        '_id': 'boneConditional',
        'conditionName': 'DogToy',
        'conditionValue': 'Bone',
        'contents': {
          'items': [
            {
              'fieldLabel': 'What flavor bone?',
              'fieldName': 'boneFlavor',
              'type': 'apostrophe-forms-text-field'
            }
          ],
          'type': 'area'
        },
        'type': 'apostrophe-forms-conditional'
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
        'fieldName': 'participate',
        'required': true,
        'checked': true,
        'type': 'apostrophe-forms-boolean-field'
      },
      {
        '_id': 'contactConditional',
        'conditionName': 'participate',
        'conditionValue': 'true',
        'contents': {
          'items': [
            {
              '_id': 'contactField',
              'fieldLabel': 'How to contact you?',
              'fieldName': 'participateContact',
              'required': true,
              'type': 'apostrophe-forms-select-field',
              'choices': [
                {
                  'label': 'email',
                  'value': 'email'
                },
                {
                  'label': 'phone',
                  'value': 'phone'
                }
              ]
            }
          ],
          'type': 'area'
        },
        'type': 'apostrophe-forms-conditional'
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
  'enableQueryParams': true,
  'queryParamList': [
    {
      'key': 'source'
    }
  ],
  'queryParamLimit': null
};
