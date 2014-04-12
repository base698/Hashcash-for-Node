package main
 
import (
  "net/http"
  "fmt"
  "strings"
  "strconv"
  "crypto/sha1"
  "io"
  "encoding/hex"
)
 
func main() {
  //bytes := make([]byte, 1024*1024)

  resp, err := http.Get("http://localhost:8000/protected")
  if err != nil {
    // handle error
    fmt.Println(err);
  }
  challenge := resp.Header.Get("x-hashcash")
  r, err := strconv.ParseUint(strings.Split(challenge,":")[0], 16, 64)

  var count uint64 = 0
  for {
    r += 1
    count++ 
    hash := sha1.New()
    strsolution := challenge+strconv.FormatUint(r,10)
    io.WriteString(hash, strsolution)
    digest := hash.Sum(nil)
    digeststr := hex.EncodeToString(digest)

    leading := digeststr[0:4]
    
    if leading == "0000" {
      fmt.Println(digeststr)
      fmt.Println(strconv.FormatUint(count,10) + " number of tries" )
      return
    } 
  }
}

