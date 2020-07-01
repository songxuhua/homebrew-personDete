# Documentation: https://docs.brew.sh/Formula-Cookbook
#                https://rubydoc.brew.sh/Formula
# PLEASE REMOVE ALL GENERATED COMMENTS BEFORE SUBMITTING YOUR PULL REQUEST!
class Idbsshpass < Formula
  desc "随便看看"
  homepage "https://github.com/songxuhua"
  url "https://github.com/songxuhua/homebrew-personDete/blob/master/idbsshpass.tar.gz"
  version ""
  sha256 ""

  # depends_on "cmake" => :build

  def install
    # ENV.deparallelize  # if your formula fails when building in parallel
    # Remove unrecognized options if warned by configure
#    system "./configure", "--disable-debug",
#                          "--disable-dependency-tracking",
#                          "--disable-silent-rules",
#                          "--prefix=#{prefix}"
    bin.install "idbsshpass"
    # system "cmake", ".", *std_cmake_args
  end

  test do
    # `test do` will create, run in and delete a temporary directory.
    #
    # This test will fail and we won't accept that! For Homebrew/homebrew-core
    # this will need to be a test that verifies the functionality of the
    # software. Run the test with `brew test idbsshpass`. Options passed
    # to `brew install` such as `--HEAD` also need to be provided to `brew test`.
    #
    # The installed folder is not in the path, so use the entire path to any
    # executables being tested: `system "#{bin}/program", "do", "something"`.
    system "false"
  end
end
