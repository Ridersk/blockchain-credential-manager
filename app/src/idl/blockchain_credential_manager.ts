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
          name: "author";
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
          name: "credentialBump";
          type: "u8";
        },
        {
          name: "title";
          type: "string";
        },
        {
          name: "label";
          type: "string";
        },
        {
          name: "secret";
          type: "string";
        },
        {
          name: "websiteUrl";
          type: "string";
        },
        {
          name: "labelPath";
          type: "string";
        },
        {
          name: "secretPath";
          type: "string";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "credentialAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "ownerAddress";
            type: "publicKey";
          },
          {
            name: "uid";
            type: "u64";
          },
          {
            name: "title";
            type: "string";
          },
          {
            name: "label";
            type: "string";
          },
          {
            name: "secret";
            type: "string";
          },
          {
            name: "websiteUrl";
            type: "string";
          },
          {
            name: "labelPath";
            type: "string";
          },
          {
            name: "secretPath";
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
          isSigner: false,
        },
        {
          name: "author",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "credentialUid",
          type: "u64",
        },
        {
          name: "credentialBump",
          type: "u8",
        },
        {
          name: "title",
          type: "string",
        },
        {
          name: "label",
          type: "string",
        },
        {
          name: "secret",
          type: "string",
        },
        {
          name: "websiteUrl",
          type: "string",
        },
        {
          name: "labelPath",
          type: "string",
        },
        {
          name: "secretPath",
          type: "string",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "credentialAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "ownerAddress",
            type: "publicKey",
          },
          {
            name: "uid",
            type: "u64",
          },
          {
            name: "title",
            type: "string",
          },
          {
            name: "label",
            type: "string",
          },
          {
            name: "secret",
            type: "string",
          },
          {
            name: "websiteUrl",
            type: "string",
          },
          {
            name: "labelPath",
            type: "string",
          },
          {
            name: "secretPath",
            type: "string",
          },
          {
            name: "createdAt",
            type: "i64",
          },
          {
            name: "updatedAt",
            type: "i64",
          },
        ],
      },
    },
  ],
};
