# Install Conan JavaScript action

This action installs conan, and sets up a default profile for you to use whereever needed. This does not install any packages - this must be done by your script, or as a part of the build system. There's many ways to work with this though. 

## Inputs

None, but there's a caveat: it requires CXX and CC to be set as environment variables. The reason for this is that it's a lot easier to do this in a shell script than in JavaScript. Specifically, Windows doesn't support syntax like `CXX=clang++ CC=clang conan ...`. I could also detect the OS and add that as an exception, but I really don't want to deal with that much JS for something that has a use elsewhere in the project as well:

```yaml
- name: Set env
  if: matrix.os != 'windows-latest'
  run: |
    echo "::set-env name=CXX::${{ matrix.compiler }}"
    echo "::set-env name=CC::${{ matrix.ccompiler }}"
```

This specific case uses a matrix, but it can be done without a matrix by hard-coding the relevant value. Note that for various reasons I don't understand, Windows can't have CC and CXX set. It makes Conan unable to detect the profile. 

## Example usage

```yaml
jobs:
  build:
    strategy:
      matrix:
        config: 
          - g++-9-ubuntu
          - clang++-9-ubuntu
          - clang++-11-macos
          - msvc-bundled-windows

        include:
          - config: g++-9-ubuntu
            os: ubuntu-latest
            compiler: g++-9
            ccompiler: gcc-9
          - config: clang++-9-ubuntu
            os: ubuntu-latest
            compiler: clang++-9
            ccompiler: clang-9
          - config: clang++-11-macos
            os: macos-latest
            compiler: clang++
            ccompiler: clang
          - config: msvc-bundled-windows
            os: windows-latest
    runs-on: ${{ matrix.os }}
    
    steps:
    - uses: actions/checkout@v2

    # Set up python; required for the conan install
    - uses: actions/setup-python@v2
    # This is only necessary if you want a specific compiler. Otherwise, this can be omitted and Conan and your build system
    # can take care of the detection. 
    - name: Set env
      if: matrix.os != 'windows-latest'
      run: |
        echo "::set-env name=CXX::${{ matrix.compiler }}"
        echo "::set-env name=CC::${{ matrix.ccompiler }}"
        ${{ matrix.compiler }} --version
    # Install conan
    - uses: LunarWatcher/install-conan@master
    # Run your build script here
    - name: Build
      run: |
        cmake
```
