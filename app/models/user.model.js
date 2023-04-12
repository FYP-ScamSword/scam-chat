import mongoose from 'mongoose';

const UserModel = mongoose.model('User',
  new mongoose.Schema(
    {
      uinfin: {
        type: String,
        required: true,
        unique: true
      },
      partialuinfin: {
        type: String
      },
      uuid: {
        type: String,
        required: true,
        unique: true
      },
      name: {
        type: String,
        required: true
      },
      sex: {
        type: {
          code: String,
          label: String
        },
        required: true
      },
      dob: {
        type: String,
        required: true
      },
      residentialstatus: {
        type: {
          code: String,
          label: String
        },
        required: true
      },
      nationality: {
        type: {
          code: String,
          label: String
        },
        required: true
      },
      birthcountry: {
        type: {
          code: String,
          label: String
        },
        required: true
      },
      mobileno: {
        areacode: {
          type: String
        },
        nbr: {
          type: String
        },
        prefix: {
          type: String
        }
      },
      email: {
        type: String,
        required: true
      },
      regadd: {
        block: {
          type: String
        },
        building: {
          type: String
        },
        street: {
          type: String
        },
        floor: {
          type: Number
        },
        unit: {
          type: Number
        },
        country: {
          type: {
            code: String,
            label: String
          }
        },
        postal: {
          type: String
        }
      }
    }));

export default UserModel;
