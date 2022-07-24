export type BlockchainCredentialManager = {
  "version": "0.1.0",
  "name": "blockchain_credential_manager",
  "instructions": [
    {
      "name": "createCredential",
      "accounts": [
        {
          "name": "credentialAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "credentialUid",
          "type": "u64"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "url",
          "type": "string"
        },
        {
          "name": "iconUrl",
          "type": "string"
        },
        {
          "name": "label",
          "type": "string"
        },
        {
          "name": "secret",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "editCredential",
      "accounts": [
        {
          "name": "credentialAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "credentialUid",
          "type": "u64"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "url",
          "type": "string"
        },
        {
          "name": "iconUrl",
          "type": "string"
        },
        {
          "name": "label",
          "type": "string"
        },
        {
          "name": "secret",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteCredential",
      "accounts": [
        {
          "name": "credentialAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "credentialAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "uid",
            "type": "u64"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "url",
            "type": "string"
          },
          {
            "name": "iconUrl",
            "type": "string"
          },
          {
            "name": "label",
            "type": "string"
          },
          {
            "name": "secret",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TitleTooLong",
      "msg": "O título deve ter no máximo 50 caracteres."
    },
    {
      "code": 6001,
      "name": "URLTooLong",
      "msg": "A URL deve ter no máximo 100 caracteres."
    },
    {
      "code": 6002,
      "name": "LabelTooLong",
      "msg": "Tamanho da label ultrapassou o limite após encriptação."
    },
    {
      "code": 6003,
      "name": "SecretTooLong",
      "msg": "Tamanho da senha ultrapassou o limite após encriptação."
    },
    {
      "code": 6004,
      "name": "DescriptionTooLong",
      "msg": "A descrição deve ter no máximo 100 caracteres."
    }
  ]
};

export const IDL: BlockchainCredentialManager = {
  "version": "0.1.0",
  "name": "blockchain_credential_manager",
  "instructions": [
    {
      "name": "createCredential",
      "accounts": [
        {
          "name": "credentialAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "credentialUid",
          "type": "u64"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "url",
          "type": "string"
        },
        {
          "name": "iconUrl",
          "type": "string"
        },
        {
          "name": "label",
          "type": "string"
        },
        {
          "name": "secret",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "editCredential",
      "accounts": [
        {
          "name": "credentialAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "credentialUid",
          "type": "u64"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "url",
          "type": "string"
        },
        {
          "name": "iconUrl",
          "type": "string"
        },
        {
          "name": "label",
          "type": "string"
        },
        {
          "name": "secret",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteCredential",
      "accounts": [
        {
          "name": "credentialAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "credentialAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "uid",
            "type": "u64"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "url",
            "type": "string"
          },
          {
            "name": "iconUrl",
            "type": "string"
          },
          {
            "name": "label",
            "type": "string"
          },
          {
            "name": "secret",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TitleTooLong",
      "msg": "O título deve ter no máximo 50 caracteres."
    },
    {
      "code": 6001,
      "name": "URLTooLong",
      "msg": "A URL deve ter no máximo 100 caracteres."
    },
    {
      "code": 6002,
      "name": "LabelTooLong",
      "msg": "Tamanho da label ultrapassou o limite após encriptação."
    },
    {
      "code": 6003,
      "name": "SecretTooLong",
      "msg": "Tamanho da senha ultrapassou o limite após encriptação."
    },
    {
      "code": 6004,
      "name": "DescriptionTooLong",
      "msg": "A descrição deve ter no máximo 100 caracteres."
    }
  ]
};
