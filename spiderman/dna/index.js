const defaultdata = require('./defaultdata')();

module.exports = {
  db: {
    // TODO 更改 workingFolder
    workingFolder: '/Users/liaoguanjie/城智/middlewareServer/database',
    collections: [
      {
        name: 'account',
        type: 'file',
        defaultData: defaultdata.account,
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
      },
      {
        name: 'person',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
      },
      {
        name: 'visitor',
        type: 'file',
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
      },
      {
        name: 'groups',
        type: 'file',
        defaultData: defaultdata.groups,
        cache: { isOpen: true, maxBytes: 10 * 1024 * 1024 },
      },
      {
        name: 'personverifyresult',
        type: 'record',
        cache: { isOpen: true, maxBytes: 20 * 1024 * 1024 },
      },
      {
        name: 'personverifyresultphoto',
        type: 'image',
      },
      {
        name: 'visitorverifyresult',
        type: 'record',
        cache: { isOpen: true, maxBytes: 20 * 1024 * 1024 },
      },
      {
        name: 'visitorverifyresultphoto',
        type: 'image',
      },
      {
        name: 'nonverifyresult',
        type: 'record',
        cache: { isOpen: true, maxBytes: 20 * 1024 * 1024 },
      },
      {
        name: 'nonverifyresultphoto',
        type: 'image',
      },
      {
        name: 'photo',
        type: 'image',
      },
      {
        name: 'settings',
        type: 'file',
        defaultData: defaultdata.settings,
        cache: { isOpen: true },
      },
      {
        name: 'eventsettings',
        type: 'file',
        defaultData: defaultdata.eventsettings,
        cache: { isOpen: false },
      },
      {
        name: 'dashboardsettings',
        defaultData: defaultdata.dashboardsettings,
        type: 'file',
        cache: { isOpen: true },
      },
      {
        name: 'attendancesettings',
        defaultData: defaultdata.attendancesettings,
        type: 'file',
        cache: { isOpen: true },
      },
      {
        name: 'managersettings',
        defaultData: defaultdata.managersettings,
        type: 'file',
        cache: { isOpen: true },
      },
      {
        name: 'systemlog',
        defaultData: defaultdata.attendancesettings,
        type: 'record',
        cache: { isOpen: true, maxBytes: 20 * 1024 * 1024 },
      },
    ],
  },
  param: {
    localhost: '127.0.0.1:8588',
    fileroot: '/userdata/aira',
    dataPath: '/data',
    swPath: '/sw',
    fwPath: '/fw',
    cgiCounter: 0,
    maxCgiNumber: 50,
    sslOptions: {
      key:
`-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDj6A8fa+3VF1mk
FQaSrbRtDhZOkd9D+CrQD2gxIMYy0Fog1opjFegDbmif2XthFyTriF1kHsh549DM
jkKZpgxnWzo1JiG/GqiDdhBGImqN5/9cE0hOW1VpLFJF39gfgeOiJLP6yhEJi+vE
1LqzMP6lo2q/6k2xfYpxpawZ0zphCdV/5gX1Dbgb/SKKeZrucrzxjrPtWgLKHWZs
zJn4EV0/9Tb6GcPK4zcTaejuUtXTZzMswuXWXOLc360iTt5fb9diTmBtXgO1bGZ9
J0fpaw5zBWIzUOLefNZawoSsJfQf8Iuu8ERsgAvqeVR8qW7a7kBaQYrhytGUf7Jv
DQV4JxI7AgMBAAECggEBALBTCeA1kHwc5K2d1sgEvGLjUz7WfPYJOpZeVS4tPSpz
KEfftJGUkTyWXzvM9zfWwCm6Bwc/CbvEFfcs2TomzdHpMs+MAO/poBaVcWHRnr7L
jzWddYOqBhqov75vwLYfuA3qd5TAYQ4Rwwc1znx0m49rL1vr2tBHYKUsmEoisjf/
/fltOgb3X2nmBpmVmkNjr8tqPK+058yhx/tLs4kT8rcHFMZwXNVr64WrXvN47saG
ZH11THOC1nhVh5ru+32dvPZeWeZ3dKPfLnxMP3fE0k3WZjTZUDwX05dHsTby6xcx
eAQzUMyCCire98WOc+aQwYPx6WUG/iYC1gDq2nQvY4ECgYEA82Q8+QL1Wc10xxkz
yuGi9s6IYIppwPhr2aUQurxyS1DbCDxyIrwTUW6GuIe2oXQe/AkZJx4h2rHPKjdJ
2JBw5INN1yf4AY1GXITr5dsJAkX5Lc7/+lVYvUskNZXW3XTO4qN+mgZWsytRvubv
nUxqURVK5aXKoAhFA6LLpPwd498CgYEA77Z2yU86/e0+Mj7NggypECNgwuWi/bYt
2dyOo8C2mVnY7nNPEyyoTw6thq61jxgBeZqbPCFpwS9JDzwsQCaZMKYnojVljGZA
SAiTnnYWD6Ldkpu8PiNQcvn+Ev3kSJ8xaruS146zNXXWtSXkLoMZ/OXddGgbKK1D
q3eCl4CXPSUCgYBKBRMR+9dYD0bTghOhQMvJ2XfaPF37JNHP6AZVdBgiVZ23PILN
k3sgiceI+SUOpv0BU1cF8YEEPI0vXo8jwJHEvTYAGBSxjCB45KfFSL7NpTApwUlR
/YC2WNLTRRWKVgrRHD3VY9YcOTFsKFl48hNnQ116x9f+oWUzvN/H9jC06wKBgFA5
Q4XZ00daF5+fLw3gCNCS1nZDfgnk53FrA/2/qByoWhZrVsJ3Bpj2s5JIdBDAmvXE
jUFReWAi4BOOMs0BXfFPGiKKNkMHkWnKHQVCRd3Txs2i+xvcm7bu/V4DxFudk19C
CUHEyysQFdwoIzaBv7fIghXMJZK2cdg3tefYLEVVAoGATc6guqPbo2U+OtkigI5R
1lDZNe2yrXgIDaUuDIKyg4+gLkdafmhWOiyoxljrKWgki5s0ofiQQF3tSTj2cuPD
47EYE4GTQD4WhyGegRQ0MPfgjfqqfosb4RSjsSlaNXb3eBqHqdFck9lsDO/4RihX
gPjiEm9cPABflqudBuKO2kE=
-----END PRIVATE KEY-----
`,
      cert:
`-----BEGIN CERTIFICATE-----
MIID/zCCAuegAwIBAgIJAOWRMu1I01KiMA0GCSqGSIb3DQEBCwUAMIGhMQswCQYD
VQQGEwJUVzEPMA0GA1UECBMGVGFpd2FuMQ8wDQYDVQQHEwZUYWlwZWkxGTAXBgNV
BAoTEEFJUkEgQ29ycG9yYXRpb24xGTAXBgNVBAsTEEFJUkEgQ29ycG9yYXRpb24x
GDAWBgNVBAMTD2FpcmFUYWJsZXQgbWluaTEgMB4GCSqGSIb3DQEJARYRc2FsZXNA
YWlyYS5jb20udHcwIBcNMjEwOTE2MDQwNjU5WhgPMjA3NjA2MTkwNDA2NTlaMIGh
MQswCQYDVQQGEwJUVzEPMA0GA1UECBMGVGFpd2FuMQ8wDQYDVQQHEwZUYWlwZWkx
GTAXBgNVBAoTEEFJUkEgQ29ycG9yYXRpb24xGTAXBgNVBAsTEEFJUkEgQ29ycG9y
YXRpb24xGDAWBgNVBAMTD2FpcmFUYWJsZXQgbWluaTEgMB4GCSqGSIb3DQEJARYR
c2FsZXNAYWlyYS5jb20udHcwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
AQDj6A8fa+3VF1mkFQaSrbRtDhZOkd9D+CrQD2gxIMYy0Fog1opjFegDbmif2Xth
FyTriF1kHsh549DMjkKZpgxnWzo1JiG/GqiDdhBGImqN5/9cE0hOW1VpLFJF39gf
geOiJLP6yhEJi+vE1LqzMP6lo2q/6k2xfYpxpawZ0zphCdV/5gX1Dbgb/SKKeZru
crzxjrPtWgLKHWZszJn4EV0/9Tb6GcPK4zcTaejuUtXTZzMswuXWXOLc360iTt5f
b9diTmBtXgO1bGZ9J0fpaw5zBWIzUOLefNZawoSsJfQf8Iuu8ERsgAvqeVR8qW7a
7kBaQYrhytGUf7JvDQV4JxI7AgMBAAGjNjA0MB0GA1UdEQQWMBSCEmEuc3BlY3Ry
b2Nsb3VkLmNvbTATBgNVHSUEDDAKBggrBgEFBQcDATANBgkqhkiG9w0BAQsFAAOC
AQEAprK0Fc1yMlCRrfC/c/3uStqBUxyx1Y2nirDm88zIfVKsshLo7sU9N28fCfMx
vc14WwRHkhxY/PEH565yxI3a3AE6DRChECkd6bkc0dbkuC9pKdH3wQOj21tsG3iO
6hKI1hQ4WF+7Qy1+raLB3zX8Q0Hu7zLFXnXXwLQ+esTAuWu9IhRrLG5VC54PoDsY
qeTQkAbO4R6Fr+CNAF59ACl6j/p9aVtwJCAARidUxEAJVvHyhGi9EkmpOUCYS/L4
LOEvtJP5HusCtsDeiiGbmJD9kgWGhC5MI5hm0pxGOJ+U5/+fBpfk6eJU36FrZ2XU
uNJRRuzG94By+yipQf7us1JHNA==
-----END CERTIFICATE-----
`,
    },
  },
};
