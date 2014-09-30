# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"


Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    config.vm.box = "ubuntu/trusty32"

    config.vm.network "forwarded_port", guest: 80, host: 8000

    config.vm.provision "shell",
        path: "vagrant/main.bash"

    config.vm.synced_folder '.', '/srv/pirates/', create: true
end
