set -e

HOST_USER="azureuser" #TODO: Replace it
GIT_URL="https://github.com/nguyenThang2302/vegetables-classification.git" #TODO: Replace it
BRANCH="${@:-develop}"
ECHO_FILE_PATH="$(pwd)/ecosystem.config.js"
SSH_KEY="-i ~/.ssh/VGTC_key.pem"
HOST="azureuser@135.237.153.220"
VERSION=$(date '+%Y%m%d%H%M%S')
HOST_PATH="/home/${HOST_USER}"
TARGET_FOLDER=""

function select_folder {
  echo "Please select the folder to deploy:"
  echo "1) AI"
  echo "2) Backend"
  echo "3) Mobile"

  read -p "Enter the number corresponding to your choice (1/2/3): " choice

  case $choice in
    1) TARGET_FOLDER="AI" ;;
    2) TARGET_FOLDER="Backend" ;;
    3) TARGET_FOLDER="Mobile" ;;
    *)
      echo "Invalid choice. Please select 1, 2, or 3."
      exit 1
      ;;
  esac

  echo "You selected: ${TARGET_FOLDER}"
}

function clean {
 TMP_PATH="$(pwd)/.tmp"
 echo ${TMP_PATH}
 rm -rf "${TMP_PATH}"
}

function build {
 echo ">>> Run build for ${TARGET_FOLDER}"
 git clone -b "${BRANCH}" "${GIT_URL}" "${TMP_PATH}"
 if [ "${TARGET_FOLDER}" = "Backend" ]; then
    cd "${TMP_PATH}/${TARGET_FOLDER}"
    ENV_FILE="$(pwd)/env.json"
    cp .env.example .env
    cat ${ENV_FILE} | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" | while read item;
    do
      arr=(${item//=/ })
      key=${arr[0]}
      value=${arr[1]}
      sed -i -e "s|^${key}=.*|${key}=\"${value}\"|g" .env
    done
    sudo yarn install
    sudo rm -rf node_modules
 fi
 if [ "${TARGET_FOLDER}" = "Mobile" ]; then
    cd "${TMP_PATH}/${TARGET_FOLDER}"
    sudo npm install
    sudo rm -rf node_modules
 fi
 if [ "${TARGET_FOLDER}" = "AI" ]; then
    cd "${TMP_PATH}/${TARGET_FOLDER}"
 fi
}

function predeploy {
 echo ">>> Run predeploy"
 ssh $SSH_KEY $HOST "mkdir -p ${HOST_PATH}/vegetables-classification/${TARGET_FOLDER}"
}

function deploy {
 echo ">>> Run deploy"
 ssh $SSH_KEY $HOST "rm -rf /${HOST_PATH}/vegetables-classification/${TARGET_FOLDER}/*"

 if [ "${TARGET_FOLDER}" = "Backend" ]; then
    # Copy code to server BE
    rsync -r -z -e "ssh ${SSH_KEY}" "${TMP_PATH}/${TARGET_FOLDER}/" "${HOST}:/${HOST_PATH}/vegetables-classification/${TARGET_FOLDER}/${VERSION}/"
    ssh $SSH_KEY $HOST "source ~/.nvm/nvm.sh && nvm use v20.17.0 && cd ${HOST_PATH}/vegetables-classification/${TARGET_FOLDER}/${VERSION}/ && ${HOST_PATH}/.nvm/versions/node/v20.17.0/bin/yarn install"
 fi

 if [ "${TARGET_FOLDER}" = "Mobile" ]; then
    # Copy code to server FE
    rsync -r -z -e "ssh ${SSH_KEY}" "${TMP_PATH}/${TARGET_FOLDER}/" "${HOST}:/${HOST_PATH}/vegetables-classification/${TARGET_FOLDER}/${VERSION}/"
    ssh $SSH_KEY $HOST "source ~/.nvm/nvm.sh && nvm use v20.17.0 && cd ${HOST_PATH}/vegetables-classification/${TARGET_FOLDER}/${VERSION}/ && ${HOST_PATH}/.nvm/versions/node/v20.17.0/bin/npm install"
 fi

 if [ "${TARGET_FOLDER}" = "AI" ]; then
    # Copy code to server AI
    rsync -r -z -e "ssh ${SSH_KEY}" "${TMP_PATH}/${TARGET_FOLDER}/src/" "${HOST}:/${HOST_PATH}/vegetables-classification/${TARGET_FOLDER}/${VERSION}/"
 fi

 # Symlink to server and restart
 # ssh $SSH_KEY $HOST "cd ${HOST_PATH}/vegetables-classification/${TARGET_FOLDER}/${VERSION}/ && ${HOST_PATH}/.nvm/versions/node/v20.17.0/bin/pm2 delete app.local"
 # ssh $SSH_KEY $HOST "cd ${HOST_PATH}/vegetables-classification/${TARGET_FOLDER}/${VERSION}/ && ${HOST_PATH}/.nvm/versions/node/v20.17.0/bin/pm2 start app.local.js"
}

function postdeploy {
 echo ">>> Run postdeploy"
 ssh $SSH_KEY $HOST "cd ${HOST_PATH}/vegetables-classification/${TARGET_FOLDER} && ls -1dt * | tail -n +2 | xargs rm -rf"
}

function main {
 select_folder
 clean
 build
 predeploy
 deploy
 postdeploy
 clean
}

main
