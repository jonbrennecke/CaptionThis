#!/usr/bin/env bash
set -x

# run prettier to formta JS files
npm run format-prettier

# run clang-format to format Objective C files
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
project_dir=$(cd "$dir/../" 2> /dev/null && pwd -P)
format=$(brew --prefix llvm)/bin/clang-format
$format -i $project_dir/ios/**/*.h $project_dir/ios/*.h $project_dir/ios/**/*.m $project_dir/ios/*.m

set +x