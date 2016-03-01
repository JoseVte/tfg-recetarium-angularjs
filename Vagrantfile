# Usage:
#
# Set the hostname in both:
#   * config.vm.hostname
#   * config.hostmanager.aliases
#
# Increment the IP address to avoid a clash:
#   * config.vm.network
#


Vagrant.configure("2") do |config|

  config.vm.box = "precise32"
  config.vm.hostname = "www.recetarium.dev"
  config.vm.box_url = "http://files.vagrantup.com/precise32.box"

  config.vm.network "private_network", ip: "10.10.10.102"

  config.hostmanager.enabled = true
  config.hostmanager.manage_host = true
  config.hostmanager.ignore_private_ip = false
  config.hostmanager.include_offline = true

  config.vm.synced_folder ".", "/vagrant", :id => "vagrant-root", :owner => "www-data"

  config.vm.define :print do |t|
  end

end
