require 'json'
package_json = JSON.parse(File.read('package.json'))

Pod::Spec.new do |s|
  s.name          = package_json["name"]
  s.version       = package_json["version"]
  s.summary       = package_json["description"]
  s.author        = package_json["author"]
  s.license       = package_json["license"]
  s.requires_arc  = true
  s.homepage      = package_json["homepage"]
  s.source        = { :git => "#{package_json["repository"]["url"]}" }
  s.platforms     = { :ios => "8.0", :osx => "10.14" }
  s.source_files  = "ios/**/*.{h,m}"

  s.dependency "React"
end
