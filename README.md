# Live Demo
http://15.235.146.167:3100/app/user/signin

- Can try with test credential below or create new account yourself on live site

  jitera@test.com

  qwerty123

# Database Access
##### MYSQL
- Host: 15.235.146.167
- Port: 3306
- Database: online_auction_db
- Credential: please contact me for credential

# How To Install
#### This is microservices, so please install on each folder service
`yarn install`

- Node version: 16
- Framework: ExpressJS, TypeScript

# How To Run
#### This is microservices, so please start each service with specific environment

- Refer to .env.template to create local .env
- Run command to start your service under `dev` mode

  `yarn start:dev`

- Configure nginx for FE access, this nginx config acts as a API Gateway
  1. Copy `app.conf` under `api-gateway` folder to `/etc/nginx/conf.d/`
  2. Restart nginx `sudo service nginx restart`
  3. Note: please make sure your port

# How To Run Test
All test cases is under folder __test__, to execute the test please run this command

`yarn test`

# How To deploy
Repository is using docker and github tag for deployment

#####staging/authenticate-svc/*
- To deploy authenticate service

#####staging/user-account-svc/*
- To deploy user account service

#####staging/user-balance-transactions-svc/*
- To deploy balance transaction service

#####staging/bid-market-item-svc/*
- To deploy bid market item service

#####staging/market-bid-job/*
- To deploy market item bid job

