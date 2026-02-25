
$assets = @(
    @{Url="http://localhost:3845/assets/9b3ec582131c7d1e41b8c296af2720f32ae6d867.png"; Out="public/redeem-assets/bg-main.png"},
    @{Url="http://localhost:3845/assets/ff2eb7cc252fb8439c175eb2e4cb4a9b201d86b7.svg"; Out="public/redeem-assets/group-908.svg"},
    @{Url="http://localhost:3845/assets/145b7cd0d28e06c31484bdbfd8c023b450d6bf81.svg"; Out="public/redeem-assets/ellipse-39.svg"},
    @{Url="http://localhost:3845/assets/95faa8eb7904d33314a2de5c0396e581c75de3d2.svg"; Out="public/redeem-assets/ellipse-39-stroke.svg"},
    @{Url="http://localhost:3845/assets/107002b087f39087c991badbf289d2a637540f63.svg"; Out="public/redeem-assets/group-906.svg"},
    @{Url="http://localhost:3845/assets/f1d3820cbb27e8a5e51a9575446313aeca1902b5.svg"; Out="public/redeem-assets/group-909.svg"},
    @{Url="http://localhost:3845/assets/294ea2c5f2a8b9d4457bdf08bce9b3401d7efce7.svg"; Out="public/redeem-assets/group-910.svg"},
    @{Url="http://localhost:3845/assets/e43da604b0282e6ff102a5e3fad3812651325818.svg"; Out="public/redeem-assets/group-914.svg"},
    @{Url="http://localhost:3845/assets/5ba6b2bbc57ec67cf19c849d0372c42f108fe222.svg"; Out="public/redeem-assets/group-915.svg"},
    @{Url="http://localhost:3845/assets/4a530004d2895f8a66556e41dcd3104ad80ac66d.svg"; Out="public/redeem-assets/group-916.svg"},
    @{Url="http://localhost:3845/assets/c87c2bc708a16eaf1517d285cdf46da2d51185a5.svg"; Out="public/redeem-assets/vector-386.svg"},
    @{Url="http://localhost:3845/assets/49a2bd0743de03f2f29321af64e01266abc1ac84.svg"; Out="public/redeem-assets/vector-387.svg"},
    @{Url="http://localhost:3845/assets/c7a5342db1dc2d45ba789d62575248c1180b3d42.svg"; Out="public/redeem-assets/ellipse-13.svg"},
    @{Url="http://localhost:3845/assets/d57b601ddd5026abe9b864be4d29a6472338939e.svg"; Out="public/redeem-assets/group-907.svg"},
    @{Url="http://localhost:3845/assets/a531050b94f7b107dc85ecc3b7df4afe432fe425.svg"; Out="public/redeem-assets/vector-388.svg"},
    @{Url="http://localhost:3845/assets/393632de3e998b2ea5a3df34930410c3bc3b3eb9.svg"; Out="public/redeem-assets/group-935.svg"},
    @{Url="http://localhost:3845/assets/e86c47a039b7f9702d3058af039774ed64ab8753.svg"; Out="public/redeem-assets/group-940.svg"},
    @{Url="http://localhost:3845/assets/ebc7df89f4674d7ca8a3c91a744e0b3db8827a17.svg"; Out="public/redeem-assets/group-941.svg"}
)

$dir = "public/redeem-assets"
if (!(Test-Path $dir)) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

foreach ($asset in $assets) {
    try {
        Invoke-WebRequest -Uri $asset.Url -OutFile $asset.Out
        Write-Host "Downloaded $($asset.Out)"
    } catch {
        Write-Host "Failed to download $($asset.Url): $_"
    }
}
