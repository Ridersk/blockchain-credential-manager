export type BlockchainCredentialManager = {
  version: "0.1.0";
  name: "blockchain_credential_manager";
  instructions: [
    {
      name: "createCredential";
      accounts: [
        {
          name: "credentialAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "credentialUid";
          type: "u64";
        },
        {
          name: "title";
          type: "string";
        },
        {
          name: "url";
          type: "string";
        },
        {
          name: "credentialData";
          type: "string";
        },
        {
          name: "description";
          type: "string";
        }
      ];
    },
    {
      name: "editCredential";
      accounts: [
        {
          name: "credentialAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "credentialUid";
          type: "u64";
        },
        {
          name: "title";
          type: "string";
        },
        {
          name: "url";
          type: "string";
        },
        {
          name: "credentialData";
          type: "string";
        },
        {
          name: "description";
          type: "string";
        }
      ];
    },
    {
      name: "deleteCredential";
      accounts: [
        {
          name: "credentialAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "credentialAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "uid";
            type: "u64";
          },
          {
            name: "url";
            type: "string";
          },
          {
            name: "title";
            type: "string";
          },
          {
            name: "credentialData";
            type: "string";
          },
          {
            name: "description";
            type: "string";
          },
          {
            name: "createdAt";
            type: "i64";
          },
          {
            name: "updatedAt";
            type: "i64";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "TitleTooLong";
      msg: "Title should be 50 characters long maximum.";
    },
    {
      code: 6001;
      name: "URLTooLong";
      msg: "URL should be 100 characters long maximum.";
    },
    {
      code: 6002;
      name: "CredentialDataTooLong";
      msg: "Credential data should be 512 characters long.";
    },
    {
      code: 6003;
      name: "DescriptionTooLong";
      msg: "Description should be 100 characters long maximum.";
    }
  ];
};

export const IDL: BlockchainCredentialManager = {
  version: "0.1.0",
  name: "blockchain_credential_manager",
  instructions: [
    {
      name: "createCredential",
      accounts: [
        {
          name: "credentialAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "credentialUid",
          type: "u64"
        },
        {
          name: "title",
          type: "string"
        },
        {
          name: "url",
          type: "string"
        },
        {
          name: "credentialData",
          type: "string"
        },
        {
          name: "description",
          type: "string"
        }
      ]
    },
    {
      name: "editCredential",
      accounts: [
        {
          name: "credentialAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "owner",
          isMut: false,
          isSigner: true
        }
      ],
      args: [
        {
          name: "credentialUid",
          type: "u64"
        },
        {
          name: "title",
          type: "string"
        },
        {
          name: "url",
          type: "string"
        },
        {
          name: "credentialData",
          type: "string"
        },
        {
          name: "description",
          type: "string"
        }
      ]
    },
    {
      name: "deleteCredential",
      accounts: [
        {
          name: "credentialAccount",
          isMut: true,
          isSigner: false
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true
        }
      ],
      args: []
    }
  ],
  accounts: [
    {
      name: "credentialAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey"
          },
          {
            name: "uid",
            type: "u64"
          },
          {
            name: "url",
            type: "string"
          },
          {
            name: "title",
            type: "string"
          },
          {
            name: "credentialData",
            type: "string"
          },
          {
            name: "description",
            type: "string"
          },
          {
            name: "createdAt",
            type: "i64"
          },
          {
            name: "updatedAt",
            type: "i64"
          }
        ]
      }
    }
  ],
  errors: [
    {
      code: 6000,
      name: "TitleTooLong",
      msg: "Title should be 50 characters long maximum."
    },
    {
      code: 6001,
      name: "URLTooLong",
      msg: "URL should be 100 characters long maximum."
    },
    {
      code: 6002,
      name: "CredentialDataTooLong",
      msg: "Credential data should be 512 characters long."
    },
    {
      code: 6003,
      name: "DescriptionTooLong",
      msg: "Description should be 100 characters long maximum."
    }
  ]
};
