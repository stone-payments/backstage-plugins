
#cara eu não lembro direito mas tinha uma treta em buildar o plugin no node 16.. a gente usa o 18, ai tem esse processo ai pra fazer o build
#
#isso eu rodava dentro da pasta plugins/score-card, do repositório forkado
#
#ai ele cria esse package.tar.gz e joga lá no repositório nessa branch de distribuição
#
#se não for fazer mudança daí dá pra usar só o package.tar.gz mesmo

#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

DIST_BRANCH=score-card-plugin-dist

#
# BUILDING

# Build from within the plguin dir itself :)
set -e
sudo n 16.20.1

yarn install
yarn tsc
yarn build
sudo n 18.12.0

#
# PACKAGING
#

# Make the package directory
cd $SCRIPT_DIR/../..
mkdir package

# Copy dist files
cp -r $SCRIPT_DIR/dist $SCRIPT_DIR/config.d.ts package/
# Create new PKG json file with correct main/types
jq '. + {"main": "dist/index.esm.js", "types": "dist/index.d.ts"}' $SCRIPT_DIR/package.json > package/package.json


# Checkout plain branch
git checkout $DIST_BRANCH

# Package things up
tar czf package.tar.gz package
rm -r package

#
# PUBLISHING
#

git add -f package.tar.gz
git commit --amend -m "build: :)"
git push -f

git checkout -
